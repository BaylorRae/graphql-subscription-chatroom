module Types
  class MutationType < Types::BaseObject
    field :message_create, mutation: Mutations::MessageCreate
  end
end
