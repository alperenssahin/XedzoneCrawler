const puppeteer = require('puppeteer');
const fs = require('fs');
(async () => {
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	// var productPages ;

	// //  await fs.readFile('page.txt', 'utf8', function(err, data) {
	// // 	if (err) throw err;
	// // 	// productPages = data.split('\n');
	// // 	productPages = data.split('\n');
	// // });
	let productPages = await fs.readFileSync('page.txt','utf8').split('\r');
	let max = await Number(productPages[0]);

	for(let x=1; x<productPages.length; x++){
		var URL = productPages[x];
		console.log('Adres kontrol ediliyor: URL:'+URL);
		
		await page.goto(URL);

	//Sekmedeki total rün sayısı üzerinden kaç sayfa taranacağı hesap edilir.
		const productDetail = await page.evaluate(max=>{
			const count =  document.getElementsByClassName('result-count');//bebek bezi vs ürünlerin baslıkları
			let data = count[0].textContent;
			data = Number(data); 
			console.log('Toplam ürün sayısı: '+data);
			let pageCount = data/48;
			if(pageCount <= 1){pageCount = 1;}
			if(pageCount >= max){
				pageCount = max;
			}
			console.log('Taranacak sayfa sayısı: '+pageCount);
			return pageCount;
			},max);

		for(let i = 1;i<=productDetail; i++){
			let title = [];
			console.log('Adres taranıyor URL:'+URL+'?sf='+i);
			await page.goto(URL+'?sf='+i);
			var data ='';
			for (let k = 0; k<48;k++){
				// console.log(k);
				data = await page.evaluate(k=>{
					return document.getElementsByClassName('product-title')[k].textContent;

				},k);
				title.push(data);
			}
			for (let dat of title){
				let spl = URL.split('/');
				let lastIndex = spl.length -1;
			// console.log(lastIndex);
			fs.appendFile('data/'+spl[lastIndex]+'.txt',dat+'\n',function (err) {
				if (err) throw err;
				// console.log('Updated!');
			});
			// console.log('data/'+spl[lastIndex]+'.txt');
		}
		}
		// for (let dat of title){
		// 	let split = URL.split('/');
		// 	// fs.appendFile('data/'+split[split.lenght - 1]+'.txt',dat);
		// 	console.log('data/'+split[split.lenght - 1]+'.txt');
		// }
}
await browser.close();
})();
