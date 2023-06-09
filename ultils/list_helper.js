const _ = require('lodash')

const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (sum, item) => {
		return sum + item.likes
	}

	return blogs.length === 0
		? 0
		: blogs.reduce(reducer, 0)
}

const favoriteBlog = blogs => {
	if (blogs.length === 0) return 'No blog in this list'
	const fav = blogs.length === 1
		? blogs[0]
		: blogs.sort((a, b) => b.likes - a.likes)[0]

	return {
		title:fav.title,
		author:fav.author,
		likes: fav.likes
	}
}

const mostBlogs = blogs => {
	const authors = _.countBy(blogs,'author')
	return({
		author:  _.maxBy(_.keys(authors),o => o),
		blogs: _.maxBy(_.values(authors),o => o)
	})
}

const mostLikes = blogs => {
	const  authorsByLikes = _(blogs).groupBy('author')
		.map((obj, key) => ({
			author: key,
			likes: obj.reduce((sum,a) => {
				return sum + a.likes
			},  0)
		}))
	return  _.maxBy(authorsByLikes.value(), 'likes')
}
module.exports = { 
	dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}