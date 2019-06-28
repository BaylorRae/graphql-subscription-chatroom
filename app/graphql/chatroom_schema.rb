class ChatroomSchema < GraphQL::Schema
  use GraphQL::Subscriptions::ActionCableSubscriptions, redis: Redis.new

  mutation(Types::MutationType)
  query(Types::QueryType)
  subscription(Types::SubscriptionType)
end
