import Boom from 'boom';

export const validationErrorParser = (request, h) => {
  const { isBoom, name } = request.response;

  if (isBoom && name === 'ValidationError') {
    const { message, validation } = request.response.output.payload;

    const errors = {};
    validation.errors.map((error) => {
      errors[error.key] = error.message;
      return error;
    });

    const error = Boom.badRequest(message);
    error.reformat();
    error.output.payload.fields = errors; // Add custom key
    throw error;
  }

  return h.continue;
};

export default {
  validationErrorParser
};
