import { Text, TextInput, View } from 'react-native';

type FormInputProps = {
    label?: string;
    placeholder: string;
    value?: string;
    onChangeText: (text: string) => void;
};

export default function FormInput({
    label,
    placeholder,
    value,
    onChangeText,
}: FormInputProps) {
    return (
        <View className="mb-3">
            {label && <Text className="mb-1 text-gray-900">{label}</Text>}
            <TextInput
                placeholder={placeholder}
                value={value}
                onChangeText={onChangeText}
                className="border p-3 rounded-xl bg-white text-green-900"
            />
        </View>
    );
}