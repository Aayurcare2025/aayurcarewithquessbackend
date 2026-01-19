import { Controller, Post, Body, Req, Res } from '@nestjs/common';

import express from 'express';
import { PayuService } from './payment.service';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Response } from 'express';
@Controller('payment')
export class PayuController {
  constructor(private readonly payuService: PayuService) {}

  // POST /payment/initiate

  //first person is coming from table:

  @Post('initiate')
  async initiatePayment(@Body() body, @Res() res: express.Response) {
    const txnid = 'TXN' + new Date().getTime(); // unique transaction ID
    const paymentData = {
      txnid,
      amount: body.amount || '',
      // amount: '200.00',
      productinfo: body.productinfo || 'Basic Plan',
      // firstname: body.firstname,
      // email: body.email,
      //  phone: body.phone || '9999999999', // add default test phone

      firstname: body.firstname || 'test',
      email: body.email || 'test@gmail.com',
      phone: body.phone || 'xxxxxxxxxx',
      // applicant_id:body.applicant_id || '',
      udf1: body.applicant_id || '',
      udf2: '',
      udf3: '',
      udf4: '',
      udf5: '', 
      surl: 'https://api.partner-quess.aayurcare.com/payment/success',
      furl: 'https://api.partner-quess.aayurcare.com/payment/failure',
      //   surl: 'http://localhost:7000/payment/success',
      // furl: 'http://localhost:7000/payment/failure',
      date:new Date(),


    

    };

    const payuData = await this.payuService.initiatePayment(paymentData);
    return res.json(payuData);
  }

  // POST /payment/callback
  @Post('callback')
  async paymentCallback(@Req() req: express.Request, @Res() res: express.Response) {
    const response = req.body;
    
    console.log("response" , response); 
    const isValid = this.payuService.verifyHash(response);

    if (isValid && response.status === 'success') {
      return res.send(' Payment Success');
    } else {
      return res.send(' Payment Failed');
    }
  }


// @Post('/success')
// handleSuccess(@Body() body, @Res() res: Response) {
//   console.log('✅ Payment success:', body);
//   // Redirect to your frontend's thank-you page
// (res as any).redirect('https://partner-quess.aayurcare.com/payment-success');
// }

// @Post('/failure')
// handleFailure(@Body() body, @Res() res: Response) {
//   console.log('❌ Payment failure:', body);
//   // Redirect to your frontend's failure page
//   // (res as any).redirect('https://partner-quess.aayurcare.com/payment-failure');
//   (res as any).redirect('http://localhost:7000/payment-failure');
// }





// @Post('/success')
// async handleSuccess(@Body() body, @Res() res: Response) {
//   console.log('Payment success:', body);

//   await this.payuService.savePayment({
//     firstname: body.firstname,
//     email: body.email,
//     phone: body.phone,
//     applicant_id:body.applicant_id,
//     amount: body.amount,
//     txnid: body.txnid,
//     productinfo: body.productinfo,
//   });

//     // await this.payuService.sendStyledEmail(body.email,body.amount);
    
//     // return { status: "success", message: "Payment saved & Email sent" };

//   // return (res as any).redirect('https://partner-quess.aayurcare.com/payment-success');
//     return (res as any).redirect('http://localhost:3000/payment-success');
// }






@Post('/failure')
handleFailure(@Body() body: any, @Res() res) {
  console.log('❌ Payment failure:', body);
  res.redirect('https://partner-quess.aayurcare.com/payment-failure');
}

@Post('/success')
handleSuccess(@Body() body: any, @Res() res) {
  console.log('✅ Payment success received');

  // Redirect immediately
  res.redirect('https://partner-quess.aayurcare.com/payment-success');

  // Background processing
  setImmediate(async () => {
    try {

      await this.payuService.savePayment({
        firstname: body.firstname,
        email: body.email,
        phone: body.phone,
        applicant_id:body.udf1,
        // applicant_id: body.applicant_idk,
        amount: body.amount,
        txnid: body.txnid,
        productinfo: body.productinfo,
      });
    } 
    catch (err) {
      console.error('❌ Post-payment error:', err);
    }
  });
}

}

