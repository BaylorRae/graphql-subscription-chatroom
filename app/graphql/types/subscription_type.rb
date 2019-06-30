module Types
  class SubscriptionType < BaseObject
    field :message_added_to_room, Types::MessageType, null: false do
      argument :room_id, Integer, required: true
    end

    def message_added_to_room(room_id:)
      object
    end
  end
end