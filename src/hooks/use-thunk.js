import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { validateError } from "../helpers/validateError";

export function useThunk(thunk) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const runThunk = useCallback(
    async (arg) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await dispatch(thunk(arg)).unwrap();
        return { success: true, response: response };
      } catch (err) {
        const validatedError = validateError(err, navigate);
        setError(validatedError);
        return { success: false, error: validatedError };
      } finally {
        setIsLoading(false);
      }
    },
    [dispatch, thunk, navigate]
  );

  return [runThunk, isLoading, error];
}
