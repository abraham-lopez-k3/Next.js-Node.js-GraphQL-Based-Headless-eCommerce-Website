import React, { useEffect, useState, useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { TextInput } from "../../components";
import { useSelector, useDispatch } from "react-redux";
import { shippingAction } from "../../../store/action/";
import viewStyles from "../../viewStyles";
import { get, isEmpty } from "lodash";

const ShippingComponent = ({
  product,
  onShippingInputChange,
  onShippingClassChange,
}) => {
  const classes = viewStyles();
  const dispatch = useDispatch();
  const shippingState = useSelector((state) => state.shippings);
  const inputLabel = useRef(null);
  const [labelWidth, setLabelWidth] = useState(0);

  useEffect(() => {
    if (!shippingState.shipping.global.is_global) {
      setLabelWidth(inputLabel.current.offsetWidth);
    }
    dispatch(shippingAction());
  }, []);

  useEffect(() => {
    const shippingClass = get(product, 'shippingClass');
    const classes = get(shippingState, 'shipping.shippingClass', []);
    if (!isEmpty(classes)) {
      const hasShippingClass = classes.some(cls => cls._id === shippingClass);
      onShippingClassChange(hasShippingClass ? shippingClass : get(classes, '[0]._id'));
    }
  }, [shippingState.shipping]);
  return (
    <>
      <Grid container spacing={3}>
        <Grid item md={12}>
          {!shippingState.shipping.global.is_global ? (
            <FormControl className={classes.cstmSelect} variant='outlined'>
              <InputLabel ref={inputLabel} id='Shipping-name'>
                Shipping
              </InputLabel>
              <Select
                label='Shipping'
                labelWidth={labelWidth}
                labelId='Shipping-name'
                id='Shipping-name'
                name='Shipping-name'
                value={product.shippingClass||''}
                onChange={(e) => onShippingClassChange(e.target.value)}
              >
                {shippingState.shipping.shippingClass.map(
                  (shipping, index) => {
                    return (
                      <MenuItem value={shipping._id} key={index}>
                        {shipping.name}
                      </MenuItem>
                    );
                  }
                )}
              </Select>
            </FormControl>
          ) : (
            <em className={classes.noteline}>
              The global shipping option is on currently. To configure the
              shipping for individual products, please turn off the global
              shipping option first.
            </em>
          )}
        </Grid>
        <Grid item md={3}>
          <TextInput
            label='Height'
            name='height'
            type='number'
            value={product.height}
            onChange={(e) => {
              onShippingInputChange("height", e.target.value);
            }}
          />
        </Grid>

        <Grid item md={3}>
          <TextInput
            label='Width'
            name='width'
            type='number'
            value={product.width}
            onChange={(e) => {
              onShippingInputChange("width", e.target.value);
            }}
          />
        </Grid>

        <Grid item md={3}>
          <TextInput
            label='Depth'
            name='depth'
            type='number'
            value={product.depth}
            onChange={(e) => {
              onShippingInputChange("depth", e.target.value);
            }}
          />
        </Grid>

        <Grid item md={3}>
          <TextInput
            label='Weight'
            name='weigth'
            variant='outlined'
            type='number'
            value={product.weight}
            onChange={(e) => {
              onShippingInputChange("weight", e.target.value);
            }}
          />
        </Grid>
      </Grid>{" "}
    </>
  );
};

export default ShippingComponent;
