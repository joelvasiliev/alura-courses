const AWS = require('aws-sdk')
AWS.config.update({
    region: 'sa-east-1'
})
const sqs = new AWS.SQS();
const QUEUE_URL = 'https://sqs.sa-east-1.amazonaws.com/483512691173/teste-001.fifo';

(async () => {
    const messages = await sqs.receiveMessage({
        QueueUrl: QUEUE_URL,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20
    }).promise();

    console.log(messages)

    if (messages.Messages) {
        messages.Messages.forEach(async message => {
            try {
                const body = JSON.parse(message.Body);
                console.log('processando mensagem...');
                console.log(`mensagem encontrada do chatid: ${body.chatid}`);
                await sqs.deleteMessage({
                    QueueUrl: QUEUE_URL,
                    ReceiptHandle: message.ReceiptHandle
                }).promise();
                console.log('mensagem processada (e excluída) com sucesso!');
            } catch (e) {
                throw new Error('Mensagem não está no formato JSON');
            }
        })
    }
})();