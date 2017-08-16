const {Readable} = require('stream')

const browserify = require('browserify')
const figify = require('figify')

module.exports = () => {
	return (req, res) => {
		const paths = req.body
		const b = browserify({ignoreMissing: true})

		b.transform(figify)

		Object.keys(paths).map(fileName => {
			const code = paths[fileName]
			const stream = new Readable()

			stream.push(code)
			stream.push(null)
			stream.file = fileName

			return {stream, fileName}
		}).forEach(entry => {
			b.add(entry.stream, {expose: entry.fileName})
		})

		b.bundle((err, buf) => {
			if (err) {
				delete err.stream
				res.status(400).send(err)
			} else {
				res.send(buf)
			}
		})
	}
}