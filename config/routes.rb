Rails.application.routes.draw do
  root to: 'chat#index'

  mount ActionCable.server, at: '/cable'

  post "/graphql", to: "graphql#execute"
  if Rails.env.development?
    mount GraphiQL::Rails::Engine, at: "/graphiql", graphql_path: "/graphql"
  end

  get '*path', to: 'chat#index'
end
