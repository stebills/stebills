import mongoose, { Schema, Document } from 'mongoose';

export interface IChargeSetting {
  type: 'percentage' | 'flat';
  value: number;
}

interface ISocialMedia {
  twitter?: string;
  facebook?: string;
  linkedIn?: string;
  instagram?: string;
}

export interface IAdminSettings extends Document {
  prices: {
    airtelData: IChargeSetting;
    airtelCGData: IChargeSetting;
    gloCGData: IChargeSetting;
    gloSMEData: IChargeSetting;
    gloGiftingData: IChargeSetting;
    etisalatData: IChargeSetting;
    etisalatCGData: IChargeSetting;
    mtnSMEData: IChargeSetting;
    mtnCGData: IChargeSetting;
    mtnGiftingData: IChargeSetting;
    smileData: IChargeSetting;
    airtimeDiscount: Omit<IChargeSetting, 'type'> & { type: 'percentage' };
    rechargeCardDiscount: Omit<IChargeSetting, 'type'> & { type: 'percentage' };
    educationPinCharge: Omit<IChargeSetting, 'type'> & { type: 'percentage' };
    electricityCharge: Omit<IChargeSetting, 'type'> & { type: 'flat' };
    withdrawalCharge: Omit<IChargeSetting, 'type'> & { type: 'flat' };
    transferCharge: Omit<IChargeSetting, 'type'> & { type: 'flat' };
    cableCharge: IChargeSetting;
  };
  agentDiscount: IChargeSetting;
  accountActivationByEmail: boolean;
  socialMedia: ISocialMedia;
}

const ChargeSettingSchema: Schema = new Schema({
  type: { type: String, enum: ['percentage', 'flat'], required: true },
  value: { type: Number, required: true, default: 10 },
});

const AdminSettingsSchema: Schema = new Schema({
  prices: {
    airtelData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    airtelCGData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    gloCGData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    gloSMEData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    gloGiftingData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    etisalatData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    etisalatCGData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    mtnSMEData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    mtnCGData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    mtnGiftingData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    smileData: { type: ChargeSettingSchema, required: true, default: { type: 'percentage', value: 10 } },
    airtimeDiscount: { 
      type: ChargeSettingSchema, 
      required: true, 
      default: { type: 'percentage', value: 10 },
    },
    rechargeCardDiscount: { 
      type: ChargeSettingSchema, 
      required: true, 
      default: { type: 'percentage', value: 10 },
    },
    educationPinCharge: { 
      type: ChargeSettingSchema, 
      required: true, 
      default: { type: 'percentage', value: 10 },
    },
    electricityCharge: { 
      type: ChargeSettingSchema, 
      required: true, 
      default: { type: 'flat', value: 10 },
    },
    withdrawalCharge: { 
      type: ChargeSettingSchema, 
      required: true, 
      default: { type: 'flat', value: 10 },
    },
    transferCharge: { 
      type: ChargeSettingSchema, 
      required: true, 
      default: { type: 'flat', value: 10 },
    },
    cableCharge: { 
      type: ChargeSettingSchema, 
      required: true, 
      default: { type: 'percentage', value: 10 },
    },
  },
  agentDiscount: { 
    type: ChargeSettingSchema, 
    required: true, 
    default: { type: 'percentage', value: 10 },
  },
  accountActivationByEmail: { type: Boolean, required: true, default: false },
  socialMedia: {
    twitter: { type: String, required: false },
    facebook: { type: String, required: false },
    linkedIn: { type: String, required: false },
    instagram: { type: String, required: false },
  },
});

const AdminSettings = mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema);

export default AdminSettings;
