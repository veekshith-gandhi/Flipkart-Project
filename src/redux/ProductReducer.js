import { actionConstants } from "./Action";
import { loadData, saveData } from "../utils/localStorage";

const products = loadData("products") || null;

const initialState = {
  products: products,
  cart: [],
  product: {},
  isLoading: true,
  isError: false,
};

export default function ProductReducer(state = initialState, action) {
  switch (action.type) {
    case actionConstants.GET_PRODUCTS_REQUEST:
      return { ...state, isLoading: true };
    case actionConstants.GET_PRODUCTS_SUCCESS:
      saveData("products", action.payload.products);
      return { ...state, products: action.payload.products, isLoading: false };
    case actionConstants.GET_SINGLE_PRODUCT:
      console.log(action.payload.product);
      return {
        ...state,
        product: action.payload.product,
        isLoading: false,
      };
    case actionConstants.GET_PRODUCTS_FAILURE:
      return { ...state, isError: true };
    case actionConstants.ADD_CART:
      if (state.cart.some((item) => item.id === action.payload.id)) {
        return {
          ...state,
          cart: state.cart.map((i) =>
            i.id === action.payload.id
              ? { ...i, qty: i.qty + action.payload.qty }
              : i
          ),
        };
      } else {
        return { ...state, cart: [...state.cart, action.payload] };
      }
    case actionConstants.REMOVE_CART:
      const existingCartItem = state.cart.find(
        (item) => item.id === action.payload.id
      );
      //if there is only 1, upon clicking, we should remove the item from the array
      if (existingCartItem.qty === 1) {
        return {
          ...state,
          cart: state.cart.filter((item) => item.id !== action.payload.id),
        };
      }

      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, qty: item.qty - 1 } : item
        ),
      };

    default:
      return state;
  }
}
