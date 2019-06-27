module Types
  class RoomType < BaseObject
    field :id, Integer, null: false
    field :title, String, null: false
    field :last_message, Types::MessageType, null: true

    def last_message
      repo = MessageRepository.new
      repo.last_for_room(room_id: object.id)
    end
  end
end
