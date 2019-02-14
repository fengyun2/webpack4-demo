function foo() {
  const arr = [1, 4, 7, 9, null, undefined, 2, 4, 7, 1, 1, 1, 3, 4, 7];
  console.log([...new Set(arr)]);
  console.info('hello from foo!');
  console.log('xxxxx');
}

export default foo;
