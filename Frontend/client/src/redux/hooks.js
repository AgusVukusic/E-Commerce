import { useDispatch, useSelector } from 'react-redux';

/**
 * Hook personalizado para usar dispatch de Redux
 * @returns {Function} dispatch function
 */
export const useAppDispatch = () => useDispatch();

/**
 * Hook personalizado para usar selector de Redux
 * @type {Function}
 */
export const useAppSelector = useSelector;

