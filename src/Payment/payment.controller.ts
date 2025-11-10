import { Controller, Post, Body, Req, Res } from '@nestjs/common';

import express from 'express';
import { PayuService } from './payment.service.';

@Controller('payment')
export class PayuController {
  constructor(private readonly payuService: PayuService) {}

  // POST /payment/initiate
  @Post('initiate')
  async initiatePayment(@Body() body, @Res() res: express.Response) {
    const txnid = 'TXN' + new Date().getTime(); // unique transaction ID
    const paymentData = {
      txnid,
      amount: body.amount,
      productinfo: body.productinfo,
      firstname: body.firstname,
      email: body.email,
       phone: body.phone || '9999999999', // add default test phone
      surl: 'http://localhost:7000/payment/success',
      furl: 'http://localhost:7000/payment/failure',
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

@Post('/success')
handleSuccess(@Body() body, @Res() res: Response) {
  console.log('✅ Payment success:', body);
  // Redirect to your frontend's thank-you page
(res as any).redirect('http://localhost:3000/payment-success');
}

@Post('/failure')
handleFailure(@Body() body, @Res() res: Response) {
  console.log('❌ Payment failure:', body);
  // Redirect to your frontend's failure page
  (res as any).redirect('http://localhost:3000/payment-failure');




 
}
}
