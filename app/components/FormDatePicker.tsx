import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

type Props = {
    label: string;
    value: Date | null;
    onChange: (date: Date) => void;
};

export default function FormDatePicker({ label, value, onChange }: Props) {
    const [show, setShow] = useState(false);

    return (
        <View className="mb-3">
            <Text className="mb-1 text-gray-50">{label}</Text>

            <Pressable
                onPress={() => setShow(true)}
                className="border p-3 rounded-xl bg-white"
            >
                <Text>
                    {value ? value.toDateString() : 'Select date'}
                </Text>
            </Pressable>

            {show && (
                <DateTimePicker
                    value={value || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShow(false);
                        if (selectedDate) onChange(selectedDate);
                    }}
                    className='text-gray-200'
                />
            )}
        </View>
    );
}