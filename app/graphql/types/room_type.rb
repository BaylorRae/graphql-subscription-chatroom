module Types
  class RoomType < BaseObject
    field :id, Integer, null: false
    field :title, String, null: false
    field :latest_messages, [Types::MessageType], null: false

    def latest_messages
      repo = MessageRepository.new
      repo.latest_for_room(room_id: object.id)
    end
  end
end
