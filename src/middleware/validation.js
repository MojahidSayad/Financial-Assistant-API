const { z } = require('zod');

const chatSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required and cannot be empty.'),
  message: z.string().min(1, 'message is required and cannot be empty.')
});

function validateChatRequest(req, res, next) {
  const result = chatSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_INPUT',
        message: result.error.errors[0].message
      }
    });
  }

  next();
}

module.exports = { validateChatRequest };