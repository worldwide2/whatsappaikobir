const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');

// ক্লায়েন্ট ইনিশিয়ালাইজ করা (সেশন সেভ থাকবে যাতে বারবার স্ক্যান করতে না হয়)
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
        ]
    }
});

// QR কোড জেনারেট
client.on('qr', (qr) => {
    console.log('\n====================================================');
    console.log('নিচের QR কোডটি আপনার হোয়াটসঅ্যাপ দিয়ে স্ক্যান করুন:');
    console.log('====================================================\n');
    qrcode.generate(qr, { small: true });
});

// কানেক্ট হলে নোটিফিকেশন
client.on('ready', () => {
    console.log('\n[SUCCESS] হোয়াটসঅ্যাপ বট সফলভাবে চালু হয়েছে এবং কাজ করছে!\n');
});

// মেসেজ রিসিভ ও অটো-রিপ্লাই
client.on('message', async (msg) => {
    // শুধু প্রাইভেট চ্যাটে আসা নতুন মেসেজ ফিল্টার করবে (গ্রুপ মেসেজ বাদ দেবে)
    if (!msg.from.includes('@g.us')) {
        const userText = msg.body.toLowerCase();

        // সাধারণ কুশল বিনিময় বা বিজ্ঞাপনের লিংকে ক্লিক করে নক দিলে
        const welcomeMessage = `স্বাগতম আমাদের এজেন্সিতে! 🎬\n\nআমরা নতুন ও প্রতিশ্রুতিশীল অভিনেতাদের নিয়ে শর্ট ফিল্ম, টিভি বিজ্ঞাপন ও ড্রামায় কাজ করছি।\n\n📌 **আমাদের সাথে কাজ করার নিয়ম:**\n১. প্রাথমিক সিলেকশন সম্পূর্ণ ফ্রীতে হয়।\n২. আমরা আপনাকে কাজের সুযোগ ও সঠিক গাইডলাইন দেব।\n\n📸 **পরবর্তী ধাপ:**\nঅনুগ্রহ করে আপনার একটি সাম্প্রতিক ভালো ছবি এবং বায়োডাটা (নাম, বয়স, উচ্চতা, বর্তমান ঠিকানা) এই চ্যাটে পাঠিয়ে দিন।\n\nআমাদের কাস্টিং টিম আপনার তথ্য ও ছবি দেখে ভালো লাগলে খুব শীঘ্রই যোগাযোগ করবে। ধন্যবাদ!`;

        await msg.reply(welcomeMessage);
        console.log(`[REPLIED] -> ${msg.from}`);
    }
});

client.initialize();
