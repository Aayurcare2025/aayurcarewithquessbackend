import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class PayuService {
  private key = process.env.PAYU_KEY;
  private salt = process.env.PAYU_SALT;
  private payuUrl = process.env.PAYU_BASE_URL ;

  // ✅ Step 1: Generate hash for transaction (exact PayU format)
 generateHash(data: any): string {
  const hashString =
    `${this.key}|${data.txnid}|${data.amount}|${data.productinfo}` +
    `|||||||||||||${this.salt}`;
    
  console.log("Correct PayU Hash String:", hashString);

  return crypto.createHash('sha512').update(hashString).digest('hex');
}

  // ✅ Step 2: Prepare payment initiation data
  async initiatePayment(paymentData: any) {
    const hash = this.generateHash(paymentData);
    return {
      ...paymentData,
      key: this.key,
      hash,
      payuUrl: this.payuUrl + '/_payment',
    };
  }

  // ✅ Step 3: Verify PayU callback hash
verifyHash(response: any): boolean {
  const hashString = `${this.salt}|${response.status}|||||||||||${response.productinfo}|${response.amount}|${response.txnid}|${this.key}`;

  const hash = crypto.createHash('sha512').update(hashString).digest('hex');
  return hash === response.hash;
}

}
