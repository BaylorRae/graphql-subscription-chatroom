module Types
  class MessageType < BaseObject
    field :id, Integer, null: false
    field :user, String, null: false
    field :text, String, null: false
    field :created_at, String, null: false
  end
end
