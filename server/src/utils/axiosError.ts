export const logAxiosError = (context: string, error: any) => {
  if (error.response) {
    console.error(`[${context}] response error:`, error.response.status, error.response.data);
  } else if (error.request) {
    console.error(`[${context}] no response received:`, error.request);
  } else {
    console.error(`[${context}] request setup error:`, error.message);
  }
};
