class CreateMessages < ActiveRecord::Migration[6.0]
  def change
    create_table :messages do |t|
      t.belongs_to :room, null: false, foreign_key: true
      t.string :user, null: false
      t.text :text, null: false

      t.timestamps
    end
  end
end
