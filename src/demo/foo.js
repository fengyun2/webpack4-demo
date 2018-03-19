import _ from 'lodash';
// import moment from 'moment';
import { format } from 'date-fns';

function foo() {
  const arr = [1, 4, 7, 9, null, undefined, 2, 4, 7, 1, 1, 1, 3, 4, 7];
  console.log([...new Set(arr)]);
  console.info('hello from foo!');
  console.log('xxxxx');
  console.log(_.add(1, 2));
  // console.log(moment(1521423080000).format('YYYY-MM-DD HH:mm:ss'));
  console.log(format(1521423080000, 'YYYY-MM-DD HH:mm:ss'));
}

export default foo;
