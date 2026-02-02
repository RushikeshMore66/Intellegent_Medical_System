
from fastapi import FastAPI
from app.api.v1 import router as api_router

app = FastAPI(
    title="Medicine Intelligence API",
    description="Agent-based medical intelligence backend",
    version="1.0.0"
)

app.include_router(api_router, prefix="/api/v1")



def main():
    print("Hello from medical-system!")


if __name__ == "__main__":
    main()
