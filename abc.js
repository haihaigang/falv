var a = [[],[],[],[],[],[],[],[],[]];

for(var i = 0; i < 9; i++){
	for(var j = 0; j<9; j++){
		a[i][j] = -1;
	}
}


for(var i = 0; i < 9; i++){
	for(var j = 0; j< 9; j++){
		a[i][j] = getRandom(i,j);
	}
}

var res = '';
for(var i = 0; i < 9; i++){
	for(var j = 0; j< 9; j++){
		res += a[i][j] + ' ';
	}
	res += '\r\n'
}
console.log(res);


function getRandom(i,j){
	var num = [];

	var m = ~~(i / 3),n = ~~(j / 3);
	var x = (m ) * 3 + (n );
	var temp = [];

	for(var k = 0; k < 9; k++){
		if(a[i][k] != -1){
			temp.push(a[i][k]);
		}
		if(a[k][j] != -1){
			temp.push(a[k][j]);
		}
		var a1 = ~~(k/3);
		var a2 = ~~(k%3);

		//i j => ?
		//0 0 => 1  1 0 => 1  2 0 => 1  3 0 =>4
		//0 1 => 1  1 1 => 1  2 1 => 1
		//0 2 => 1  1 2 => 1  2 2 => 1
		//0 3 => 2  1 3 => 2  2 3 => 2


		if(a[a1 + m * 3][a2 + n * 3] != -1){
			temp.push(a[a1 + m * 3][a2 + n * 3]);
		}

		//num.push(k+1);
	}
	for(k0 = 1; k0 <= 9; k0++){
		var flag = false;
		for(k1 = 0; k1 < temp.length; k1++){
			if(temp[k1] == k0){
				flag = true;
			}
		}
		if(!flag){
			num.push(k0);
		}
	}

	if(num.length == 0) return -9;

	var r = ~~(Math.random() * num.length);

	return num[r];
}