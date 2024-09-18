import { createContext, useContext, useReducer } from "react";
import { useState } from 'react';
import { DUMMY_PRODUCTS } from "../dummy-products";

export const ShopContext = createContext();

export const useShopContext = () => {
  return useContext(ShopContext);
}

const reducer = (state, action) => {
  if (action.type === 'ADD_ITEM') {
    const updatedItems = [...state.items];

    const existingCartItemIndex = updatedItems.findIndex(
      (cartItem) => cartItem.id === action.payload
    );
    const existingCartItem = updatedItems[existingCartItemIndex];

    if (existingCartItem) {
      const updatedItem = {
        ...existingCartItem,
        quantity: existingCartItem.quantity + 1,
      };
      updatedItems[existingCartItemIndex] = updatedItem;
    } else {
      const product = DUMMY_PRODUCTS.find(
        (product) => product.id === action.payload
      );
      updatedItems.push({
        id: action.payload,
        name: product.title,
        price: product.price,
        quantity: 1,
      });
    }

    return {
      ...state, // not needed here because we have only one value
      items: updatedItems,
    };

  }

  if (action.type === 'UPDATE_ITEM') {
    const updatedItems = [...state.items];
    const updatedItemIndex = updatedItems.findIndex(
      (item) => item.id === action.payload.productId
    );

    const updatedItem = {
      ...updatedItems[updatedItemIndex],
    };

    updatedItem.quantity += action.payload.amount;

    if (updatedItem.quantity <= 0) {
      updatedItems.splice(updatedItemIndex, 1);
    } else {
      updatedItems[updatedItemIndex] = updatedItem;
    }

    return {
      ...state,
      items: updatedItems,
    };
  }

  return state;
}

export const ShopContextProvider = ({ children }) => {

  const [shoppingCart, dispatch] = useReducer(reducer, { items: [] })

  function handleAddItemToCart(id) {
    dispatch({ type: 'ADD_ITEM', payload: id })
  }

  function handleUpdateCartItemQuantity(productId, amount) {
    dispatch({ type: 'UPDATE_ITEM', payload: { productId, amount } })
  }
  return (
    <ShopContext.Provider value={{ shoppingCart, handleAddItemToCart, handleUpdateCartItemQuantity }}>
      {children}
    </ShopContext.Provider>
  )
}