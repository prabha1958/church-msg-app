import { Text, View } from 'react-native';
import MaskInput, { Masks } from 'react-native-mask-input';

type Props = {
    label: string;
    value?: string;
    onChangeText: (text: string) => void;
};

export default function FormDateInput({ label, value, onChangeText }: Props) {
    return (
        <View className="mb-3">
            <Text className="mb-1 text-gray-50">{label}</Text>

            <MaskInput
                value={value}
                onChangeText={(masked) => onChangeText(masked)}
                mask={Masks.DATE_YYYYMMDD}
                placeholder="YYYY/MM/DD"
                className="border p-3 rounded-xl bg-white"
                keyboardType="numeric"
            />
        </View>
    );
}