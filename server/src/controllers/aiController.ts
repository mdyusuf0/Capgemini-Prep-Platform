import { Request, Response } from 'express';
import { AIConversation } from '../models/AIConversation.js';
import { getAIProvider } from '../services/ai/provider.js';
import { getPrompt } from '../services/ai/prompts.js';
import { AuthRequest } from '../middleware/auth.js';

export const startConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { context, problemId, assistanceLevel } = req.body;
    
    const conversation = await AIConversation.create({
      userId: req.user!._id,
      context,
      problemId,
      assistanceLevel: assistanceLevel || 2,
      messages: [],
      promptCount: 0
    });

    res.status(201).json({ success: true, data: conversation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { conversationId, content } = req.body;
    
    const conversation = await AIConversation.findOne({ _id: conversationId, userId: req.user!._id });
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    // Add user message
    conversation.messages.push({ role: 'user', content, timestamp: new Date() });
    conversation.promptCount += 1;

    // Get AI Response
    const provider = getAIProvider();
    const systemPrompt = getPrompt(conversation.assistanceLevel, conversation.context);
    
    // Map messages
    const chatMessages = conversation.messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content
    }));

    const aiResponseContent = await provider.chat(chatMessages, systemPrompt);

    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponseContent,
      timestamp: new Date()
    });

    await conversation.save();

    res.status(200).json({ success: true, data: conversation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const conversation = await AIConversation.findOne({ _id: id, userId: req.user!._id });
    
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    res.status(200).json({ success: true, data: conversation });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUsageStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const conversations = await AIConversation.find({ userId: req.user!._id });
    
    const totalPrompts = conversations.reduce((sum, conv) => sum + conv.promptCount, 0);
    const totalConversations = conversations.length;
    
    res.status(200).json({ 
      success: true, 
      data: { totalPrompts, totalConversations } 
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
