module Types
  class QueryType < Types::BaseObject
    field :rooms, [Types::RoomType], null: false
    def rooms
      room_repository.all
    end

    field :messages_for_room, [Types::MessageType], null: false do
      argument :room_id, Integer, required: true
    end

    def messages_for_room(room_id:)
      message_repository.latest_for_room(room_id: room_id)
    end

    private

    def room_repository
      @room_repository ||= RoomRepository.new
    end

    def message_repository
      @message_repository ||= MessageRepository.new
    end
  end
end
