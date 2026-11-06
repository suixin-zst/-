#!/usr/bin/env node

// 测试注册功能的简单脚本
const https = require('https');

// 测试注册请求
const testData = {
  name: '测试用户',
  email: 'test@example.com',
  password: 'test123456',
  role: 'host'
};

const postData = JSON.stringify(testData);

const options = {
  hostname: 'zhuchi-j43iiixky-suixin-zst.vercel.app',
  port: 443,
  path: '/api/auth/test-signup',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData),
  },
};

const req = https.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log(`响应头: ${JSON.stringify(res.headers, null, 2)}`);

  res.on('data', (d) => {
    process.stdout.write(d);
  });
});

req.on('error', (e) => {
  console.error(`请求遇到问题: ${e.message}`);
});

req.write(postData);
req.end();