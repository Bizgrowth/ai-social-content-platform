import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type Platform = 'facebook' | 'instagram' | 'linkedin' | 'twitter';

interface GenerateRequest {
  platforms: Platform[];
  topic: string;
  tone: string;
  targetAudience: string;
  callToAction: string;
  keywords: string;
  contentType: string;
  includeHashtags: boolean;
  includeEmojis: boolean;
}

interface PlatformSpecs {
  maxLength: number;
  bestPractices: string[];
  imageRequired: boolean;
}

const platformSpecs: Record<Platform, PlatformSpecs> = {
  twitter: {
    maxLength: 280,
    bestPractices: [
      'Keep it concise and punchy',
      'Use relevant hashtags (2-3 max)',
      'Include a clear call-to-action',
      'Make every word count',
    ],
    imageRequired: false,
  },
  instagram: {
    maxLength: 2200,
    bestPractices: [
      'Visual storytelling is key',
      'First sentence must hook the reader',
      'Use line breaks for readability',
      'Include 5-10 relevant hashtags',
      'Emojis enhance engagement',
    ],
    imageRequired: true,
  },
  facebook: {
    maxLength: 63206,
    bestPractices: [
      'First 2-3 sentences are crucial (visible before "See More")',
      'Ask questions to boost engagement',
      'Use emojis and formatting',
      'Include a clear call-to-action',
      'Moderate hashtag use (2-5)',
    ],
    imageRequired: false,
  },
  linkedin: {
    maxLength: 3000,
    bestPractices: [
      'Professional yet personable tone',
      'Start with a compelling hook',
      'Share insights or value',
      'Use bullet points or short paragraphs',
      'Minimal emojis, minimal hashtags (3-5)',
    ],
    imageRequired: false,
  },
};

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is not configured. Please add it to your .env.local file.' },
        { status: 500 }
      );
    }

    const body: GenerateRequest = await request.json();
    const { platforms, topic, tone, targetAudience, callToAction, keywords, contentType, includeHashtags, includeEmojis } = body;

    if (!platforms || platforms.length === 0) {
      return NextResponse.json({ error: 'At least one platform must be selected' }, { status: 400 });
    }

    if (!topic || topic.trim() === '') {
      return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
    }

    const anthropic = new Anthropic({ apiKey });

    // Generate content for each platform in parallel
    const contentPromises = platforms.map(async (platform) => {
      const specs = platformSpecs[platform];

      const prompt = `You are an expert social media content creator specializing in viral, engaging content.

Create a ${platform.toUpperCase()} post with these specifications:

TOPIC/MESSAGE: ${topic}

PLATFORM: ${platform}
- Maximum length: ${specs.maxLength} characters
- Best practices: ${specs.bestPractices.join('; ')}
- Image ${specs.imageRequired ? 'REQUIRED' : 'optional'}

REQUIREMENTS:
- Tone: ${tone}
${targetAudience ? `- Target Audience: ${targetAudience}` : ''}
${callToAction ? `- Call to Action: ${callToAction}` : ''}
${keywords ? `- Keywords to include: ${keywords}` : ''}
- Content Type: ${contentType}
- Include Hashtags: ${includeHashtags ? 'YES' : 'NO'}
- Include Emojis: ${includeEmojis ? 'YES' : 'NO'}

IMPORTANT FORMATTING RULES:
1. Return ONLY a valid JSON object with this exact structure:
{
  "content": "The main post text here",
  "hashtags": ["#hashtag1", "#hashtag2"],
  "imagePrompt": "A detailed image prompt for AI image generation"
}

2. The "content" field should contain the main post text WITHOUT hashtags
3. The "hashtags" array should contain 0-10 hashtags as separate items (empty array if includeHashtags is NO)
4. The "imagePrompt" should be a detailed description for generating an eye-catching image${!specs.imageRequired ? ' (can be empty string if not needed)' : ''}
5. Optimize the content for ${platform}'s algorithm and best practices
6. Make it compelling, viral-worthy, and action-oriented
7. DO NOT include any markdown formatting, code blocks, or additional text outside the JSON

Generate the content now:`;

      const message = await anthropic.messages.create({
        model: 'claude-3-haiku-20240307',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      });

      const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

      // Parse the JSON response
      let parsedResponse;
      try {
        // Try to extract JSON from the response
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          parsedResponse = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No JSON found in response');
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', responseText);
        // Fallback: create a basic response
        parsedResponse = {
          content: responseText,
          hashtags: [],
          imagePrompt: '',
        };
      }

      return {
        platform,
        content: parsedResponse.content || '',
        hashtags: parsedResponse.hashtags || [],
        imagePrompt: parsedResponse.imagePrompt || '',
      };
    });

    const content = await Promise.all(contentPromises);

    // Save to database
    let contentItemId = null;
    try {
      const supabase = await createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Transform content array into JSONB format
        const generatedContentJson = content.reduce((acc, item) => {
          acc[item.platform] = {
            content: item.content,
            hashtags: item.hashtags,
            imagePrompt: item.imagePrompt,
          };
          return acc;
        }, {} as Record<string, any>);

        const { data: contentItem, error: insertError } = await supabase
          .from('content_items')
          .insert({
            user_id: user.id,
            topic,
            platforms,
            tone,
            content_type: contentType,
            generated_content: generatedContentJson,
            status: 'draft',
          })
          .select('id')
          .single();

        if (!insertError && contentItem) {
          contentItemId = contentItem.id;
        }
      }
    } catch (dbError) {
      console.error('Failed to save to database:', dbError);
      // Don't fail the request if database save fails
    }

    return NextResponse.json({ content, contentItemId });
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate content' },
      { status: 500 }
    );
  }
}
