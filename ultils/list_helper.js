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
	blogs.length === 1
		? blogs[0]
		: blogs.sort((a, b) => a.likes - b.likes)[0]
}

module.exports = { 
	dummy,
	totalLikes,
	favoriteBlog
}