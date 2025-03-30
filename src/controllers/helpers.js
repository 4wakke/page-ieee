
export const isValidEmail = (email) => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);

export const isValidPassword = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);

export const isValidDocType = (docType) => ['CC', 'TI', 'CE', 'PA'].includes(docType);

export const isValidPhoneNumber = (phone) => /^\d{7,15}$/.test(phone);

export const isValidBirthDate = (date) => {
   const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;
   const birthDate = new Date(date);
   const today = new Date();
  return birthDate <= today;
};

export const isValidName = (name) => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name);

export const isValidMembershipNumber = (number) => /^[a-zA-Z0-9]{5,20}$/.test(number);

export const isValidGender = (gender) => ['Male', 'Female', 'Other'].includes(gender);

export const isValidTaxAmount = (amount) => /^\d+(\.\d{1,2})?$/.test(amount);

export const successResponse = (res, message, results = [], statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      results,
      status_code: statusCode,
    });
};
  
export const errorResponse = (res, message, statusCode = 400, error = null) => {
    return res.status(statusCode).json({
      success: false,
      message,
      status_code: statusCode,
      ...(error && { error }) // Solo incluye el campo 'error' si está presente
    });
};