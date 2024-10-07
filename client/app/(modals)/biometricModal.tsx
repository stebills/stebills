import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import Bio from '@/assets/svg/bio.svg';
import { useThemeColor } from '@/hooks/useThemeColor';

interface BiometricModalProps {
  visible: boolean;
  onClose: () => void;
}

const BiometricModal: React.FC<BiometricModalProps> = ({
  visible,
  onClose,
}) => {
  const green500 = useThemeColor({}, 'green500');
  const gray800 = useThemeColor({}, 'gray800');
  const modalBgColor = useThemeColor({}, 'modalBgColor');

  const [bgColor, setBgColor] = useState(gray800);

  return (
    <Modal
      visible={visible}
      animationType='slide'
      transparent
      onRequestClose={onClose}
    >
      <View className='flex-1 justify-end bg-black/80'>
        <View
          className='rounded-t-3xl p-6 items-center'
          style={[{ height: '40%' }, { backgroundColor: modalBgColor }]}
        >
          <Text className='text-lg font-bold mb-3'>
            Enable Biometric Authentication
          </Text>
          <Text className='text-base text-gray-500 mb-8'>
            Touch fingerprint sensor to activate
          </Text>

          {/* Biometric Icon */}
          <View className='mb-10'>
            <Bio
              width={80}
              height={80}
            />
          </View>

          {/* Done Button */}
          <TouchableOpacity
            className='rounded-lg w-full py-3 px-8 bg-gray-800'
            style={{ backgroundColor: bgColor }}
            onPress={() => {
              onClose();
              setBgColor(green500);
            }}
          >
            <Text className='text-lg text-center text-white'>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BiometricModal;
