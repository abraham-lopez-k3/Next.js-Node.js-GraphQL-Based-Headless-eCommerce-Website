import React, { useState, useEffect } from "react";
import { CircularProgress, Box } from "@mui/material";
import ReactSelect from "react-select";
import { isEmpty } from "../../../utils/helper";
import { useSelector, useDispatch } from "react-redux";
import { brandsAction } from "../../../store/action/";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme/index.js";
import { customStyles } from "../../../theme/ReactSelectCustomStyles";
const BrandSelectionComponent = ({ value, onBrandChange }) => {
  const dispatch = useDispatch();
  const brandState = useSelector((state) => state.brands);
  const [brands, setbrands] = useState([]);

  useEffect(() => {
    if (!isEmpty(brandState)) {
      dispatch(brandsAction());
    }
  }, []);

  useEffect(() => {
    const brandObj = brandState.brands.map((brand) => {
      return {
        value: brand.id,
        label: brand.name,
      };
    });

    setbrands([...brandObj]);
  }, [brandState.brands]);

  return (
    <>
      {brandState.loading ? (
        <Box component="div" display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      ) : (
        <ReactSelect
          name="brand"
          options={brands}
          onChange={onBrandChange}
          value={value}
          styles={customStyles}
        />
      )}
    </>
  );
};

const BrandSelection = ({ value, onBrandChange }) => {
  return (
    <ThemeProvider theme={theme}>
      <BrandSelectionComponent value={value} onBrandChange={onBrandChange} />
    </ThemeProvider>
  );
};
export default BrandSelection;
