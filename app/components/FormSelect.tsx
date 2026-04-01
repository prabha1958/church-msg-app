import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native';

type Props = {
    label: string;
    value?: string;
    onChange: (value: string) => void;
    items: { label: string; value: string }[];
};

export default function FormSelect({ label, value, onChange, items }: Props) {
    return (
        <View className="mb-3">
            <Text className="mb-1 text-gray-50">{label}</Text>

            <View className="border rounded-xl bg-white">
                <Picker
                    selectedValue={value}
                    onValueChange={(val) => onChange(val)}

                >
                    <Picker.Item label="Select..." value="" />
                    {items.map((item) => (
                        <Picker.Item
                            key={item.value}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </Picker>
            </View>
        </View>
    );
}