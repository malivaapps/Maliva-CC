const successResponse = (res, code, message, data, meta) => {
     return res.status(code).json({
          status: 'success',
          code,
          message,
          data,
          meta,
     });
}

const errorResponse = (res, code, message, errors) => {
     return res.status(code).json({
          status: 'error',
          code,
          message,
          errors,
     });
};

module.exports = { successResponse, errorResponse }