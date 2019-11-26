// Import External Dependancies
const graphql = require('graphql')

// Destructure GraphQL functions
const {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLInt,
	GraphQLID,
	GraphQLList,
	GraphQLNonNull
} = graphql

// Import Controllers
const itemController = require('../src/controllers/itemController')
const makerController = require('../src/controllers/makerController')
const serviceController = require('../src/controllers/serviceController')

// Define Object Types
const itemType = new GraphQLObjectType({
	name: 'Item',
	fields: () => ({
		_id: { type: GraphQLID },
		name: { type: GraphQLString },
		brand: { type: GraphQLString },
		price: { type: GraphQLString },
		quantity: { type: GraphQLInt },
		maker_id: { type: GraphQLID },
		maker: {
			type: makerType,
			async resolve(parent, args) {
				return await makerController.getSingleMaker({ id: parent.maker_id })
			}
		},
		services: {
			type: new GraphQLList(serviceType),
			async resolve(parent, args) {
				return await serviceController.getItemsServices({ id: parent._id })
			}
		}
	})
})

const makerType = new GraphQLObjectType({
	name: 'Maker',
	fields: () => ({
		_id: { type: GraphQLID },
		firstName: { type: GraphQLString },
		lastName: { type: GraphQLString },
		email: { type: GraphQLString },
		items: {
			type: new GraphQLList(itemType),
			async resolve(parent, args) {
				return await makerController.getMakersItems({ id: parent._id })
			}
		}
	})
})

const serviceType = new GraphQLObjectType({
	name: 'Service',
	fields: () => ({
		_id: { type: GraphQLID },
		item_id: { type: GraphQLID },
		name: { type: GraphQLString },
		date: { type: GraphQLString },
		item: {
			type: itemType,
			async resolve(parent, args) {
				return await itemController.getSingleItem({ id: parent.item_id })
			}
		}
	})
})

// Define Root Query
const RootQuery = new GraphQLObjectType({
	name: 'RootQueryType',
	fields: {
		item: {},
		items: {},
		maker: {},
		service: {}
	}
})

// Define Mutations
const Mutations = new GraphQLObjectType({
	name: 'Mutations',
	fields: {
		addItem: {
			type: itemType,
			args: {},
			async resolve(args) {
				return ''
			}
		},
		editItem: {
			type: itemType,
			args: {},
			async resolve(args) {
				return ''
			}
		},
		deleteItem: {
			type: itemType,
			args: {},
			async resolve(args) {
				return ''
			}
		}
	}
})

// Export the schema
module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutations
})