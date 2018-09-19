
import LinkGenerator from '../LinkGenerator';

describe('LinkGenerator', () => {

	it('should encode query parameters into a string', () => {
		let parameters = {
			someString: 'This is some string... {}./$-_#<>',
			number: 1234.12,
			'another[]}^>*-&=()`~@': 'hello there'
		};
		let expected1 = 'someString=This%20is%20some%20string...%20%7B%7D.' +
				'%2F%24-_%23%3C%3E&number=1234.12&' +
				'another%5B%5D%7D%5E%3E*-%26%3D()%60~%40=hello%20there';
		let expected2 = 'someString:This%20is%20some%20string...%20%7B%7D.' +
				'%2F%24-_%23%3C%3E;number:1234.12;' +
				'another%5B%5D%7D%5E%3E*-%26%3D()%60~%40:hello%20there';
		let expected3 = 'someString=This is some string... {}./$-_#<>&' +
				'number=1234.12&' +
				'another[]}^>*-&=()`~@=hello there';
		let encoded1 = LinkGenerator.encodeQuery(parameters);
		let encoded2 = LinkGenerator.encodeQuery(parameters, ';', ':');
		let encoded3 = LinkGenerator.encodeQuery(parameters, '&', '=', a => a);
		
		expect(encoded1).toBe(expected1);
		expect(encoded2).toBe(expected2);
		expect(encoded3).toBe(expected3);
	});

});
