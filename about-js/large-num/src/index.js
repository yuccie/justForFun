// 两个大数相加
export default function bigNumAdd(a, b) {
  let i = a.length - 1;
  let j = b.length - 1;
  
  let res = ''; // 结果
  let carry = 0; // 进位
  while(i >= 0 || j >= 0) {
    let x = 0;
    let y = 0;
    let sum = 0;

    if (i >= 0) {
      x = +a[i]; // 字符串转为数字
      i--;
    }

    if (j >= 0) {
      y = +b[j]; // 字符串转为数字
      j--;
    }

    sum = x + y + carry;

    if (sum >= 10) {
      carry = 1;
      sum -= 10;
    } else {
      carry = 0;
    }

    // 注意拼接的顺序
    res = sum + res;
  }

  if (carry) {
    res = carry + res;
  }
  return res;
}
