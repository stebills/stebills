import axios from 'axios';

class VtPassHelpers {
  static apiUrl = 'https://sandbox.vtpass.com/api'; // Use 'https://api-service.vtpass.com/api' for live
  static secretKey = process.env.VTPASS_SECRET_KEY as string;
  static apiKey = process.env.VTPASS_API_KEY as string;
  static publicKey = process.env.VTPASS_PUBLIC_KEY as string;

  static async getServiceId(identifier: string) {
    try {
      const basicAuth = Buffer.from(
        `${this.apiKey}:${this.publicKey}`
      ).toString('base64');

      // const identifier = 'tv-subscription';

      if (!identifier) {
        throw new Error('Identifier is required 🥲');
      }

      const url = `${process.env.VTPASS_SERVICE_ID}/services?identifier=${identifier}`;

      const response = await axios.get(url, {
        headers: { authorization: `Basic ${basicAuth}` },
      });
      const options = response.data.content;

      const modifiedOptions = options.map((option: any) => {
        return {
          serviceID: option.serviceID,
          name: option.name,
          image: option.image,
        };
      });

      return modifiedOptions;
    } catch (error: any) {
      console.error('Error fetching VTpass serviceID', error);
      throw error;
    }
  }

  static async getVariationCodes(serviceID: string) {
    const url = `${process.env.VTPASS_GET_VARIATION_CODES}?serviceID=${serviceID}`;

    const basicAuth = Buffer.from(
      `${this.apiKey}:${this.publicKey}`
    ).toString('base64');

    const response = await axios.get(url, {
      headers: { authorization: `Basic ${basicAuth}` },
    });
    const options = response.data;

    const modifiedOptions = options.content.varations.map((option: any) => {
      return {
        variationCode: option.variation_code,
        name: option.name,
        variationAmount: option.variation_amount,
        image: option.image,
      };
    });

    return modifiedOptions;
  }

  static async queryTransactionStatus(requestId: any) {
    const queryPayload = { request_id: requestId };
    const url = process.env.VTPASS_REQUERY;

    if (!url) throw new Error('url is required 😒');
    const headers = {
      'api-key': this.apiKey,
      'secret-key': this.secretKey,
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.post(url, queryPayload, {
        headers: headers,
      });
      // Check if the response and its data are defined
      if (response && response.data) {
        return response;
      } else {
        throw new Error('No response data');
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  static async verifyCustomer(
    billersCode: string,
    type: string,
    serviceID: string
  ) {
    try {
      if (type === 'prepaid' || type === 'postpaid') {
        const payload = {
          billersCode,
          serviceID,
          type,
        };

        const configurations = {
          method: 'post',
          url: `${this.apiUrl}/merchant-verify`,
          headers: {
            'api-key': this.apiKey,
            'secret-key': this.secretKey,
            'Content-Type': 'application/json',
          },
          data: payload,
        };

        const response = await axios(configurations);
        return { error: false, verifyInfo: response.data };
      } else {
        const payload = {
          billersCode,
          serviceID,
        };
        const configurations = {
          method: 'post',
          url: `${this.apiUrl}/merchant-verify`,
          headers: {
            'api-key': this.apiKey,
            'secret-key': this.secretKey,
            'Content-Type': 'application/json',
          },
          data: payload,
        };

        const response = await axios(configurations);
        return { error: false, verifyInfo: response.data };
      }
    } catch (error: any) {
      console.error(error);
      return { error: false, message: error.message };
    }
  }

  static async vtpassWalletBalance() {
    try {
      const configurations = {
        method: 'get',
        url: process.env.VTPASS_WALLET_BALANCE,
        headers: {
          'api-key': this.apiKey,
          'public-key': this.publicKey,
          'Content-Type': 'application/json',
        },
      };

      const response = await axios(configurations);

      const balance = response.data.contents.balance;
      return balance;
    } catch (error: any) {
      console.error(error);
      throw new Error(error);
    }
  }
}

export default VtPassHelpers;
