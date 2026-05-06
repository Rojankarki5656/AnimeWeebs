import { fail, success } from './response';

export default function withTryCatch(fn) {
  return async (c, next) => {
    try {
      const result = await fn(c, next);

      if (result instanceof Response) {
        return result;
      }

      return success(c, result, null);
    } catch (error) {
      console.error(error.message);

      if (error.statusCode) {
        return fail(c, error.message, error.statusCode, error.details);
      }
      return fail(c, error.message, 500);
    }
  };
}
