module Mutations
  class MessageCreate < BaseMutation
    argument :room_id, Integer, required: true
    argument :user, String, required: true
    argument :text, String, required: true

    field :message, Types::MessageType, null: false

    def resolve(room_id:, user:, text:)
      repo = MessageRepository.new
      message = repo.create_in_room(room_id: room_id,
                                    user: user,
                                    text: text)
      { message: message }
    end
  end
end
