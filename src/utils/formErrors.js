// DRF validation errors usually come back as either { detail: "..." } or
// { field_name: ["message", ...], other_field: ["message"] }. This pulls out
// the first useful message so forms can show *something* instead of failing
// silently when signup/login/etc. reject the request.
export function firstErrorMessage(error, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;
  if (typeof error === 'string') return error;
  if (error.detail) return error.detail;

  const firstKey = Object.keys(error)[0];
  if (firstKey) {
    const value = error[firstKey];
    const message = Array.isArray(value) ? value[0] : value;
    if (message) {
      const label = firstKey === 'non_field_errors' ? '' : `${firstKey.replace(/_/g, ' ')}: `;
      return `${label}${message}`;
    }
  }
  return fallback;
}
