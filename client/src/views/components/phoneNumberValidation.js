import MuiPhoneNumber from "material-ui-phone-number";


const PhoneNumber = ({ handleOnChange, phoneValue, width, className }) => {
    const handleChange = (value, name) => {
        handleOnChange(value, name)

    };

    return (
        <>
            <MuiPhoneNumber

                className={className}
                style={{ width: width }}
                value={phoneValue}
                defaultCountry={"us"}
                label="Phone"
                name="phone"
                variant="outlined"
                onChange={(value) => handleChange(value, "phone")}
                isValid={(value, country) => {
                    if (value.length === 0) {
                        return false;
                    } else {
                        return true;
                    }
                }}
            />
        </>
    )
}
export default PhoneNumber