class MessageRepository
  def last_for_room(room_id:)
    Message
      .where(room_id: room_id)
      .order(created_at: :desc)
      .first
  end

  def latest_for_room(room_id:)
    Message
      .where(room_id: room_id)
      .order(created_at: :asc)
      .limit(10)
  end

  def create_in_room(room_id:, user:, text:)
    Message.create!(room_id: room_id,
                    user: user,
                    text: text)
  end
end
