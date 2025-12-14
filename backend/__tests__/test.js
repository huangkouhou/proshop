// backend/__tests__/test.js

describe('backend health check', () => {
    
    // Test Case 1
    test('1 + 1 suppose to 2', () => {
        const result = 1 + 1;
        expect(result).toBe(2);
    });

    // Test Case 2
    test('PayPay config check', () => {
        const paypayConfig = {
            mode: 'sandbox',
            currency: 'JPY'
        };
        
        expect(paypayConfig.mode).toBe('sandbox');
        expect(paypayConfig.currency).not.toBe('USD'); 
    });
});