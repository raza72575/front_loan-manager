import { View, TextInput, Text } from "react-native";
import { styles } from "./styles";
export const InputField = ({
    label,
    value,
    onChangeText,
    secureTextEntry = false,
    keyboardType = 'default',
}) => (
    <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
            placeholder={`Enter Your ${label}`}
            keyboardType={keyboardType}
            style={styles.input}
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
        />
    </View>
);

